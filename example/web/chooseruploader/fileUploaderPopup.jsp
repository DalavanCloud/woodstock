<?xml version="1.0" encoding="UTF-8"?>
<!--
      DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.

	  Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.

	  The contents of this file are subject to the terms of either the GNU
	  General Public License Version 2 only ("GPL") or the Common Development
	  and Distribution License("CDDL") (collectively, the "License").  You
	  may not use this file except in compliance with the License.  You can
	  obtain a copy of the License at
	  https://oss.oracle.com/licenses/CDDL+GPL-1.1
	  or LICENSE.txt.  See the License for the specific
	  language governing permissions and limitations under the License.

	  When distributing the software, include this License Header Notice in each
	  file and include the License file at LICENSE.txt.

	  GPL Classpath Exception:
	  Oracle designates this particular file as subject to the "Classpath"
	  exception as provided by Oracle in the GPL Version 2 section of the License
	  file that accompanied this code.

	  Modifications:
	  If applicable, add the following below the License Header, with the fields
	  enclosed by brackets [] replaced by your own identifying information:
	  "Portions Copyright [year] [name of copyright owner]"

	  Contributor(s):
	  If you wish your version of this file to be governed by only the CDDL or
	  only the GPL Version 2, indicate your decision by adding "[Contributor]
	  elects to include this software in this distribution under the [CDDL or GPL
	  Version 2] license."  If you don't indicate a single choice of license, a
	  recipient has the option to distribute your version of this file under
	  either the CDDL, the GPL Version 2 or to extend the choice of license to
	  its licensees as provided above.  However, if you add GPL Version 2 code
	  and therefore, elected the GPL Version 2 license, then the option applies
	  only if the new code is made subject to such option by the copyright
	  holder.
-->

<jsp:root version="2.0" xmlns:f="http://java.sun.com/jsf/core" xmlns:h="http://java.sun.com/jsf/html" xmlns:jsp="http://java.sun.com/JSP/Page" xmlns:webuijsf="http://www.sun.com/webui/webuijsf">
    <jsp:directive.page contentType="text/html"/>
    <f:view>
        <webuijsf:page >
            <webuijsf:html>
                <f:loadBundle basename="com.sun.webui.jsf.example.resources.Resources" var="msgs" />
                <webuijsf:head id="popupUploaderHead" title="#{msgs.uploaderPopup_title}">
		  <webuijsf:link rel="shortcut icon" url="/images/favicon.ico" type="image/x-icon" />
                </webuijsf:head>
                <webuijsf:body>
                                           
                <webuijsf:form id="uploaderFormPopup">
                                           
                        <!-- Masthead -->
                        <webuijsf:masthead id="Masthead" productImageURL="/images/example_primary_masthead.png"
                                    productImageDescription="#{msgs.mastheadAltText}" 
                                    userInfo="test_user"
                                    serverInfo="test_server" />     
                         
                        <!-- Bread Crumb Component -->
                        <webuijsf:breadcrumbs id="breadcrumbs">
                            <webuijsf:hyperlink id="exampleIndex"
                                          text="#{msgs.index_title}"
                                          toolTip="#{msgs.index_title}"
                                          actionExpression="#{ChooserUploaderBean.showExampleIndex}" 
                                          onMouseOver="javascript:window.status='#{msgs.index_breadcrumbMouseOver}'; return true;"
                                          onMouseOut="javascript: window.status=''; return true" />
                            <webuijsf:hyperlink id="fileExample" actionExpression="#{ChooserUploaderBean.showUploaderIndex}" text="#{msgs.chooserUploader_title}"
                                          onMouseOver="javascript:window.status='#{msgs.chooserUploader_breadcrumbMouseOver}'; return true;"
                                          onMouseOut="javascript: window.status=''; return true" 
                                          toolTip="#{msgs.chooserUploader_title}"  /> 
                            <webuijsf:hyperlink id="uploaderPopup" text="#{msgs.uploaderPopup_title}"/>
                        </webuijsf:breadcrumbs>
                        
                        <!-- Alert for validator exception. -->
                        <webuijsf:alert id="popupUploaderAlert" rendered="#{ChooserUploaderBean.errorsOnPage}" type="error" 
                                    summary="#{ChooserUploaderBean.summaryMsg}"> 
                             <webuijsf:message for="uploaderFormPopup:dirPath" showDetail="true"/>
                             <webuijsf:message for="uploaderFormPopup:upload" showDetail="true"/>
                        </webuijsf:alert>
                          
                        <!-- Page Title -->
                        <webuijsf:contentPageTitle id="uploaderContentPage" title="#{msgs.uploaderPopup_title}" />
                       
                        <webuijsf:markup tag="div" styleClass="#{themeStyles.CONTENT_MARGIN}">
                        <table><tr><td></td></tr>
                        <tr style="height:20px"><td>
                        </td></tr>
                                                        
                        <!-- Text Field for user input -->
                        <tr><td>
                            <webuijsf:label id="labelId" for="upload" text="#{msgs.uploader_uploadLabel}"/>                           
                            <webuijsf:image id="space" url="/theme/com/sun/webui/jsf/suntheme/images/other/dot.gif"
                                      width="67" height="1"/>
                            <webuijsf:upload id="upload"  
                                       uploadedFile = "#{ChooserUploaderBean.uploadedFile}"
                                       required="true"/>
                         </td></tr>
                         <tr style="height:20px"><td></td></tr>
                                   
                         <!-- File Uploader -->
                         <tr><td>
                            <webuijsf:textField id="dirPath" columns="38"  
                                         text="#{ChooserUploaderBean.uploadPath}" label="#{msgs.uploader_textFieldlabel}"
                                         toolTip="#{msgs.uploader_textFieldTooltip}" >
                               <f:validator validatorId="dirValidator"/>
                            </webuijsf:textField>
                        <f:verbatim><![CDATA[ &nbsp; ]]></f:verbatim>

                        <!--Select Folder button - opens folder chooser in popup window. -->
                            <webuijsf:button primary="true"  text="#{msgs.uploader_buttonTextFolder}" id="folder"  
                                       onClick="javascript: var win = window.open('../chooseruploader/folderChooserPopup.jsp',
                                                'folderchooserPopup','height=630,width=750,top='+((screen.height-(screen.height/1.618))-(500/2))+',
                                                left='+((screen.width-650)/2)+',scrollbars,resizable');win.focus();return false" 
                                        toolTip="#{msgs.uploader_folderButtonToolTip}"/>
                         </td></tr>
                         <tr style="height:20px"><td></td></tr>
                         <tr><td>
                        <!-- File Uploader Button -->
                            <webuijsf:button primary="true"  text="#{msgs.uploader_uploadButtonCaption}" id="button"  
                                       actionExpression="#{ChooserUploaderBean.writeFile}"
                                       toolTip="#{msgs.uploader_uploadButtonToolTip}"/>
                         </td></tr>
                                                     
                         <!-- File Chooser Link -->
                          <tr><td>
                            <webuijsf:label id="textLabel1" text="#{msgs.uploader_fileChooserText1}"/>
                            
                            <!-- File Chooser hyper link - opens file chooser in a popup window.-->
                            <webuijsf:hyperlink  id="popupFile" text="#{msgs.uploader_fileChooserLink}" toolTip="#{msgs.uploader_fileChooserLinkTooltip}" 
                                           onClick="javascript: var win = window.open('../chooseruploader/fileChooserPopup.jsp',
                                                    'filechooserPopup','height=630,width=750,top='+((screen.height-(screen.height/1.618))-(500/2))+',
                                                    left='+((screen.width-650)/2)+',scrollbars,resizable'); win.focus(); return false" />
                            <webuijsf:label id="textLabel2" text="#{msgs.uploader_fileChooserText2}" />
                          </td></tr></table>
                          </webuijsf:markup>
                                    
                    </webuijsf:form>
                </webuijsf:body>
            </webuijsf:html>
        </webuijsf:page>
    </f:view>
</jsp:root>
