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

package javax.faces.component;

import com.sun.rave.designtime.Constants;
import com.sun.rave.designtime.markup.AttributeDescriptor;
import java.beans.BeanDescriptor;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.beans.SimpleBeanInfo;
import java.util.Locale;
import java.util.ResourceBundle;

/**
 * BeanInfo for {@link javax.faces.component.UIComponentBase}.
 *
 * @author gjmurphy
 */
public class UIComponentBaseBeanInfo extends SimpleBeanInfo {
        
    protected static ResourceBundle resourceBundle =
            ResourceBundle.getBundle("javax.faces.component.bundle", Locale.getDefault());
    
    private Class componentClass;
    private String unqualifiedClassName;
    
    public UIComponentBaseBeanInfo() {
        this.componentClass = UIComponentBase.class;
        String className = componentClass.getName();
        unqualifiedClassName = className.substring(className.lastIndexOf(".") + 1);
    }
    
    /**
     * Constructor for use by extending classes.
     */
    protected UIComponentBaseBeanInfo(Class componentClass) {
        this.componentClass = componentClass;
        String className = componentClass.getName();
        unqualifiedClassName = className.substring(className.lastIndexOf(".") + 1);
    }
    
    private String instanceName;
    
    protected String getInstanceName() {
        if (instanceName == null) {
            String str = this.componentClass.getName();
            StringBuffer buffer = new StringBuffer();
            buffer.append(str.substring(0, 1).toLowerCase());
            buffer.append(str.substring(1));
            instanceName = buffer.toString();
        }
        return instanceName;
    }
    
    BeanDescriptor beanDescriptor;
    
    public BeanDescriptor getBeanDescriptor() {
        if (beanDescriptor != null)
            return beanDescriptor;
        beanDescriptor = new BeanDescriptor(componentClass);
        String instanceName = getInstanceName();
        if (instanceName != null)
            beanDescriptor.setValue(com.sun.rave.designtime.Constants.BeanDescriptor.INSTANCE_NAME, instanceName);
        return beanDescriptor;
    }
    
    private PropertyDescriptor[] propertyDescriptors;
    
    public PropertyDescriptor[] getPropertyDescriptors() {
        
        if (propertyDescriptors != null)
            return propertyDescriptors;
        
        try {
            AttributeDescriptor attrib = null;
        
            PropertyDescriptor prop_id = new PropertyDescriptor("id", UIComponent.class, "getId", "setId");
            prop_id.setDisplayName(resourceBundle.getString("UIComponent_id_DisplayName"));
            prop_id.setShortDescription(resourceBundle.getString("UIComponent_id_Description"));
            attrib = new AttributeDescriptor("id", false, null, true);
            prop_id.setValue(Constants.PropertyDescriptor.ATTRIBUTE_DESCRIPTOR, attrib);
            
            PropertyDescriptor prop_rendered = new PropertyDescriptor("rendered", UIComponent.class, "isRendered", "setRendered");
            prop_rendered.setDisplayName(resourceBundle.getString("UIComponent_rendered_DisplayName"));
            prop_rendered.setShortDescription(resourceBundle.getString("UIComponent_rendered_Description"));
            attrib = new AttributeDescriptor("rendered", false, null, true);
            prop_rendered.setValue(Constants.PropertyDescriptor.ATTRIBUTE_DESCRIPTOR, attrib);
            PropertyDescriptor prop_attributes = new PropertyDescriptor("attributes", UIComponent.class, "getAttributes", null);
            prop_attributes.setHidden(true);
            
            PropertyDescriptor prop_childCount = new PropertyDescriptor("childCount", UIComponent.class, "getChildCount", null);
            prop_childCount.setHidden(true);
            
            PropertyDescriptor prop_children = new PropertyDescriptor("children", UIComponent.class, "getChildren", null);
            prop_children.setHidden(true);
            
            PropertyDescriptor prop_facets = new PropertyDescriptor("facets", UIComponent.class, "getFacets", null);
            prop_facets.setHidden(true);
            
            PropertyDescriptor prop_family = new PropertyDescriptor("family", UIComponent.class, "getFamily", null);
            prop_family.setHidden(true);
            
            PropertyDescriptor prop_parent = new PropertyDescriptor("parent", UIComponent.class, "getParent", null);
            prop_parent.setHidden(true);
            
            PropertyDescriptor prop_rendererType = new PropertyDescriptor("rendererType", UIComponent.class, "getRendererType", "setRendererType");
            prop_rendererType.setHidden(true);
            
            PropertyDescriptor prop_rendersChildren = new PropertyDescriptor("rendersChildren", UIComponent.class, "getRendersChildren", null);
            prop_rendersChildren.setHidden(true);
            
            propertyDescriptors = new PropertyDescriptor[] {
                prop_attributes, 
                prop_childCount, 
                prop_children, 
                prop_facets, 
                prop_family, 
                prop_id, 
                prop_parent, 
                prop_rendered, 
                prop_rendererType, 
                prop_rendersChildren
            };
            return propertyDescriptors;
            
        } catch (IntrospectionException e) {
            e.printStackTrace();
            return null;
        }
        
    }
    
    /**
     * Utility method that returns a class loaded by name via the class loader that
     * loaded this class.
     */
    protected static Class loadClass(String name) {
        try {
            return Class.forName(name);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
    
}
