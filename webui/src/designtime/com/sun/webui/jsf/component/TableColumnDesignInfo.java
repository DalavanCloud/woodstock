/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common Development
 * and Distribution License("CDDL") (collectively, the "License").  You
 * may not use this file except in compliance with the License.  You can
 * obtain a copy of the License at
 * https://oss.oracle.com/licenses/CDDL+GPL-1.1
 * or LICENSE.txt.  See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * When distributing the software, include this License Header Notice in each
 * file and include the License file at LICENSE.txt.
 *
 * GPL Classpath Exception:
 * Oracle designates this particular file as subject to the "Classpath"
 * exception as provided by Oracle in the GPL Version 2 section of the License
 * file that accompanied this code.
 *
 * Modifications:
 * If applicable, add the following below the License Header, with the fields
 * enclosed by brackets [] replaced by your own identifying information:
 * "Portions Copyright [year] [name of copyright owner]"
 *
 * Contributor(s):
 * If you wish your version of this file to be governed by only the CDDL or
 * only the GPL Version 2, indicate your decision by adding "[Contributor]
 * elects to include this software in this distribution under the [CDDL or GPL
 * Version 2] license."  If you don't indicate a single choice of license, a
 * recipient has the option to distribute your version of this file under
 * either the CDDL, the GPL Version 2 or to extend the choice of license to
 * its licensees as provided above.  However, if you add GPL Version 2 code
 * and therefore, elected the GPL Version 2 license, then the option applies
 * only if the new code is made subject to such option by the copyright
 * holder.
 */

package com.sun.webui.jsf.component;

import com.sun.data.provider.TableDataProvider;
import com.sun.rave.designtime.DesignContext;
import com.sun.rave.designtime.DesignBean;
import com.sun.rave.designtime.DesignProperty;
import com.sun.rave.designtime.Result;
import com.sun.webui.jsf.component.table.TableDesignHelper;
import com.sun.webui.jsf.component.util.DesignMessageUtil;
import com.sun.webui.jsf.design.AbstractDesignInfo;
import java.sql.ResultSet;

/**
 * DesignInfo for the <code>TableColumn</code> component. The following behavior is
 * implemented:
 * <ul>
 * <li>Upon component creation, pre-populate with one Static Text.</li>
 * </ul>
 *
 * @author Winston Prakash
 */
public class TableColumnDesignInfo extends AbstractDesignInfo {
    
    private static final String WIDTH_PROPERTY = "width";
    
    public TableColumnDesignInfo() {
        super(TableColumn.class);
    }
    
    public Result beanCreatedSetup(DesignBean tableColumnBean) {
        int colNo = tableColumnBean.getBeanParent().getChildBeanCount();
        String columnHeaderText = DesignMessageUtil.getMessage(TableColumnDesignInfo.class,"tableColumn.headerText", new Object[] {String.valueOf(colNo)});
        DesignProperty headerTextProperty = tableColumnBean.getProperty("headerText"); //NOI18N
        headerTextProperty.setValue(columnHeaderText);
        DesignProperty widthProperty = tableColumnBean.getProperty("width"); //NOI18N
        widthProperty.setValue(String.valueOf(200));
        DesignContext context = tableColumnBean.getDesignContext();
        if (context.canCreateBean(StaticText.class.getName(), tableColumnBean, null)) {
            DesignBean staticTextBean = context.createBean(StaticText.class.getName(), tableColumnBean, null);
            DesignProperty textProperty = staticTextBean.getProperty("text"); //NOI18N
            textProperty.setValue(staticTextBean.getBeanInfo().getBeanDescriptor().getDisplayName());
        }
        return Result.SUCCESS;
    }
    
    /** {@inheritDoc} */
    public Result beanDeletedCleanup(DesignBean bean) {
        // Adjust table width if table column width is et in pixels
        int oldColumnWidth = -1;
        Object oldValue = bean.getProperty(WIDTH_PROPERTY).getValue();
        if(oldValue != null){
            String oldColumnWidthStr = (String)oldValue;
            if (oldColumnWidthStr.indexOf("%") == -1) { //NOI18N
                try{
                    oldColumnWidth = Integer.parseInt(oldColumnWidthStr);
                }catch(Exception exc){
                }
            }
        }
        TableDesignHelper.adjustTableWidth(bean.getBeanParent().getBeanParent(), oldColumnWidth, 0);
        return Result.SUCCESS;
    }
    
    /**
     * {@inheritDoc}
     * Accept only StaticText, Button or Field as Child
     */
    public boolean acceptChild(DesignBean parentBean, DesignBean childBean, Class childClass) {
        if(childClass.isAssignableFrom(StaticText.class) ||
                //childClass.isAssignableFrom(TableColumn.class) ||
                childClass.isAssignableFrom(Button.class) ||
                childClass.isAssignableFrom(TextField.class) ||
                childClass.isAssignableFrom(TextArea.class) ||
                childClass.isAssignableFrom(StaticText.class) ||
                childClass.isAssignableFrom(Label.class) ||
                childClass.isAssignableFrom(DropDown.class) ||
                childClass.isAssignableFrom(Hyperlink.class) ||
                childClass.isAssignableFrom(ImageHyperlink.class) ||
                childClass.isAssignableFrom(Checkbox.class) ||
                childClass.isAssignableFrom(RadioButton.class) ||
                childClass.isAssignableFrom(ImageComponent.class) ||
                //childClass.isAssignableFrom(RadioButtonGroup.class) ||
                //childClass.isAssignableFrom(CheckboxGroup.class) ||
                childClass.isAssignableFrom(PanelGroup.class) ||
                childClass.isAssignableFrom(Message.class)){
            return true;
        }
        return false;
    }
    
    /**
     * {@inheritDoc}
     * Accept only TableRowGroup as Parent
     */
    public boolean acceptParent(DesignBean parentBean, DesignBean childBean, Class parentClass) {
        return parentBean.getInstance().getClass().isAssignableFrom(TableRowGroup.class);
    }
    
    /**
     * Accept only Reult Set (may be not required in future) or  TableDataProvider as links
     *
     * {@inheritDoc}
     */
    public boolean acceptLink(DesignBean targetBean, DesignBean sourceBean, Class sourceClass) {
        return false;
    }
    
    /**
     * TBD - remove the earlier child and add the source bean as child
     *
     * {@inheritDoc}
     */
    
    public Result linkBeans(DesignBean targetBean, DesignBean sourceBean) {
        System.out.println(targetBean);
        System.out.println(sourceBean);
        return Result.SUCCESS;
    }
    
    /**
     * Modify the width of the table if the column width changes
     */
    public void propertyChanged(DesignProperty property, Object oldValue) {
        String propertyName = property.getPropertyDescriptor().getName();
        if(propertyName.equals(WIDTH_PROPERTY)){
            String columnWidth = (String)property.getValue();
            if(columnWidth != null){
                // If not a percentage, units are in pixels.
                // Ajust the table width only if the column width is specified in pixles
                if (columnWidth.indexOf("%") == -1){
                    int oldColumnWidth = -1;
                    if(oldValue != null){
                        String oldColumnWidthStr = (String)oldValue;
                        if (oldColumnWidthStr.indexOf("%") == -1) { //NOI18N
                            try{
                                oldColumnWidth = Integer.parseInt(oldColumnWidthStr);
                            }catch(Exception exc){
                            }
                        }
                    }
                    int newColumnWidth = -1;
                    try{
                        newColumnWidth = Integer.parseInt(columnWidth);
                    }catch(Exception exc){
                    }
                    //System.out.println("Adjusting Width of column - " + columnName);
                    // Adjust the table width to accomodate the change in width of the table column
                    TableDesignHelper.adjustTableWidth(property.getDesignBean().getBeanParent().getBeanParent(), oldColumnWidth, newColumnWidth);
                }
            }
        }
    }
}
