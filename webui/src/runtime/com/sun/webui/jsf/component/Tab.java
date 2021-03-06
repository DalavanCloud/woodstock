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

import com.sun.faces.annotation.Component;
import com.sun.faces.annotation.Property;
import com.sun.webui.jsf.event.MethodExprActionListener;
import java.util.ArrayList;
import java.util.List;
import javax.faces.component.UIComponent;
import javax.faces.component.NamingContainer;
import javax.el.ValueExpression;
import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.ActionEvent;
import javax.faces.event.ActionListener;
import javax.faces.event.FacesEvent;

/**
 * The Tab component represents one tab in a tab set. Tabs must be children of
 * a TabSet, or of another Tab.
 *
 * <p>Tab extends {@link Hyperlink}. Clicking on a tab therefore submits the
 * current page.
 */
@Component(type = "com.sun.webui.jsf.Tab", family = "com.sun.webui.jsf.Tab",
displayName = "Tab", tagName = "tab",
helpKey = "projrave_ui_elements_palette_wdstk-jsf1.2_tab",
propertiesHelpKey = "projrave_ui_elements_palette_wdstk-jsf1.2_propsheets_tab_props")
public class Tab extends Hyperlink implements NamingContainer {

    /**
     * Create a new instance of Tab.
     */
    public Tab() {
        super();
        setRendererType("com.sun.webui.jsf.Tab");
    }

    /**
     * Create a new instance of Tab with the text property set to the value
     * specified.
     */
    public Tab(String text) {
        this();
        setText(text);
    }

    @Override
    public String getFamily() {
        return "com.sun.webui.jsf.Tab";
    }

    /**
     * Scripting code executed when a mouse double click occurs over this
     * component.
     */
    @Property(isHidden = true, isAttribute = true)
    @Override
    public String getOnDblClick() {
        return super.getOnDblClick();
    }

    @Property(isHidden = true, isAttribute = false)
    @Override
    public Object getValue() {
        return super.getValue();
    }

    @Property(shortDescription = "The display label for this tab")
    @Override
    public Object getText() {
        return super.getText();
    }
    /**
     * The id of this tab's currently selected Tab child or null if one is not
     * selected.
     */
    @Property(isHidden = true)
    private String selectedChildId = null;

    /**
     * Returns the id of this tab's currently selected Tab child, or null if one is not
     * selected.
     */
    public String getSelectedChildId() {
        if (this.selectedChildId != null) {
            return this.selectedChildId;
        }
        ValueExpression _vb = getValueExpression("selectedChildId");
        if (_vb != null) {
            return (String) _vb.getValue(getFacesContext().getELContext());
        }
        return null;
    }

    /**
     * Set the id of this tab's currently selected Tab child to the value specified.
     */
    public void setSelectedChildId(String selectedChildId) {
        this.selectedChildId = selectedChildId;
    }

    /**
     * Returns the number of children of this tab that are themselves tabs.
     */
    public int getTabChildCount() {
        if (this.getChildCount() == 0) {
            return 0;
        }
        int childTabCount = 0;
        for (UIComponent child : this.getChildren()) {
            if (child instanceof Tab) {
                childTabCount++;
            }
        }
        return childTabCount;
    }

    /**
     * Returns a list of all children of this tab that are themselves tabs.
     */
    public List<Tab> getTabChildren() {
        List<Tab> tabChildren = new ArrayList<Tab>();
        for (UIComponent child : this.getChildren()) {
            if (child instanceof Tab) {
                tabChildren.add((Tab) child);
            }
        }
        return tabChildren;
    }

    /**
     * Customized implementation that allows child components to decode possible
     * submitted input only if the component is part of the currently selected
     * tab. Some input components cannot distinguish between a null submitted value
     * that is the result of the user unselecting the value (e.g. in the case of
     * a checkbox or listbox) from the case that is the result of the component
     * being hidden in an unselected tab.
     */
    @Override
    public void processDecodes(FacesContext context) {
        if (!this.isRendered()) {
            return;
        }
        TabSet tabSet = Tab.getTabSet(this);
        if (tabSet == null) {
            return;
        }
        if (this.getId() != null && this.getId().equals(tabSet.getSelected())) {
            // If this tab was the selected tab in the submitted page, invoke process
            // decodes on all children components
            for (UIComponent child : this.getChildren()) {
                child.processDecodes(context);
            }
        } else {
            // Otherwise, invoke process decodes only on any tab children, since
            // one of them, or one of their descendants, may be the tab that was
            // selected on the submitted page
            for (Tab tabChild : this.getTabChildren()) {
                tabChild.processDecodes(context);
            }
        }
        try {
            decode(context);
        } catch (RuntimeException e) {
            context.renderResponse();
            throw e;
        }
    }

    /**
     * Customized implementation that, in addition to invoking all other action
     * listeners for this tab, invokes the action listener method bound by the
     * action listener expression on this tab's parent tabSet, if there is one.
     */
    @Override
    public void broadcast(FacesEvent event) throws AbortProcessingException {
        super.broadcast(event);
        if (event instanceof ActionEvent) {
            TabSet tabSet = Tab.getTabSet(this);
            if (tabSet != null && tabSet.getActionListenerExpression() != null) {
                ActionListener listener = new MethodExprActionListener(tabSet.getActionListenerExpression());
                listener.processAction((ActionEvent) event);
            }
        }
    }

    /**
     * Restore the state of this component.
     */
    @Override
    public void restoreState(FacesContext _context, Object _state) {
        Object _values[] = (Object[]) _state;
        super.restoreState(_context, _values[0]);
        this.selectedChildId = (String) _values[1];
    }

    /**
     * Save the state of this component.
     */
    @Override
    public Object saveState(FacesContext _context) {
        Object _values[] = new Object[2];
        _values[0] = super.saveState(_context);
        _values[1] = this.selectedChildId;
        return _values;
    }

    /**
     * Utility method that returns the tabSet instance that contains the tab specified.
     */
    public static TabSet getTabSet(Tab tab) {
        TabSet tabSet = null;
        UIComponent parent = tab.getParent();
        while (tabSet == null && parent != null) {
            if (parent instanceof TabSet) {
                tabSet = (TabSet) parent;
            } else {
                parent = parent.getParent();
            }
        }
        return tabSet;
    }
}
